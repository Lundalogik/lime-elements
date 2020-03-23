/* tslint:disable max-classes-per-file */
import {
    Component,
    h,
    Prop,
    State,
    Watch,
    EventEmitter,
    Event,
} from '@stencil/core';
import { Option } from '@limetech/lime-elements';
import { FieldProps } from '../form/fields/types';

const API_VERSION = 'v1';

class LimetypeStore {
    private store = {};
    private appName: string = null;

    public async get(limetype: string): Promise<any> {
        if (!(limetype in this.store)) {
            await this.populateForLimetype(limetype);
        }

        return Promise.resolve(this.store[limetype]);
    }

    public async getTitle(limetype: string): Promise<string> {
        const data = await this.get(limetype);
        return data.localname.singular;
    }

    public async getPropertyTitle(
        limetype: string,
        property: string
    ): Promise<string> {
        const data = await this.getProperties(limetype);
        return data[property].localname;
    }

    public async isRelation(limetype: string): Promise<boolean> {
        const data = await this.get(limetype);
        return data.type === 'belongsto';
    }

    public async isRelationProperty(
        limetype: string,
        property: string
    ): Promise<boolean> {
        const data = await this.getProperties(limetype);
        return data[property].type === 'belongsto';
    }

    public async getProperties(limetype: string): Promise<any> {
        const data = await this.get(limetype);
        return data.properties;
    }

    private async populateForLimetype(limetype: string): Promise<void> {
        if (limetype in this.store) {
            return Promise.resolve();
        }

        const appName = await this.getAppName();

        return fetch(
            `/${appName}/api/v1/limetype/${limetype}?_embed=properties`
        )
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error('Failed to get limetype information');
            })
            .then(response => {
                // Convert properties from array to object keyed by property name
                response.properties = {};

                for (const property of response._embedded.properties) {
                    response.properties[property.name] = property;
                }

                response.properties['id'] = {
                    localname: 'Id',
                    name: 'id',
                    type: 'integer',
                };

                return response;
            })
            .then(response => (this.store[limetype] = response));
    }

    private getAppName(): Promise<string> {
        if (this.appName) {
            return Promise.resolve(this.appName);
        }

        return fetch(`/api/${API_VERSION}/sessions`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(
                    'Failed to get session data: ' + response.statusText
                );
            })
            .then(response => {
                this.appName = response.database;
                return response.database;
            });
    }
}

interface Path {
    title: string;
    name: string;
    relation: boolean;
}

@Component({
    tag: 'limel-property-path',
    shadow: true,
    styleUrl: 'property-path.scss',
})
export class PropertyPath {
    /**
     * Label
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop()
    public fieldProps: FieldProps;

    @Watch('fieldProps')
    valueUpdated() {
        this.initialize();
    }

    @Prop({
        reflect: true,
    })
    public limetype: string;

    @Watch('limetype')
    limetypeUpdated() {
        this.initialize();
    }

    @State()
    public limetypeInformation: any;

    @State()
    public selectedPath: Path[] = [];

    @State()
    public loading: boolean = true;

    @State()
    public currentOptions: Option[] = [];

    /**
     * Emitted when the path has changed.
     */
    @Event()
    private change: EventEmitter<string>;

    public appName: string;

    public limetypeStore: LimetypeStore = new LimetypeStore();

    constructor() {
        this.handleSelectedProperty = this.handleSelectedProperty.bind(this);
        this.handleDeletePath = this.handleDeletePath.bind(this);
    }

    async componentDidLoad() {
        this.initialize();
    }

    async initialize() {
        this.loading = true;

        this.selectedPath = await this.buildSelectedPathArray();

        this.currentOptions = await this.buildSelectOptions();

        this.loading = false;
    }

    public render() {
        return (
            <limel-flex-container
                direction="vertical"
                align="start"
                class="wrapper"
            >
                <span class="mdc-floating-label mdc-floating-label--float-above">
                    {this.label}
                </span>
                <limel-flex-container justify="start">
                    {this.loading && <limel-spinner />}
                    {!this.loading && (
                        <limel-flex-container justify="start">
                            <limel-flex-container
                                justify="start"
                                class="path-item"
                            >
                                <div class="path-text">
                                    {this.selectedPath[0].title}
                                </div>
                                <limel-icon name="chevron_right" size="small" />
                            </limel-flex-container>
                            {this.selectedPath
                                .slice(1)
                                .map((path, index, list) => {
                                    return (
                                        <limel-flex-container
                                            justify="start"
                                            class="path-item"
                                        >
                                            <div class="path-text">
                                                {path.title}
                                            </div>
                                            {index === list.length - 1 && (
                                                <limel-icon
                                                    name="delete_sign"
                                                    size="small"
                                                    class="path-delete"
                                                    onClick={
                                                        this.handleDeletePath
                                                    }
                                                />
                                            )}
                                            {path.relation && (
                                                <limel-icon
                                                    name="chevron_right"
                                                    size="small"
                                                />
                                            )}
                                        </limel-flex-container>
                                    );
                                })}
                            {this.isLastPathARelation() && (
                                <limel-select
                                    class="property-select"
                                    options={this.currentOptions}
                                    required={true}
                                    value={null}
                                    label="Select Property..."
                                    onChange={this.handleSelectedProperty}
                                />
                            )}
                        </limel-flex-container>
                    )}
                </limel-flex-container>
            </limel-flex-container>
        );
    }

    private isLastPathARelation(): boolean {
        return this.selectedPath[this.selectedPath.length - 1].relation;
    }

    private getLastRelationPath(): Path {
        if (this.isLastPathARelation()) {
            return this.selectedPath[this.selectedPath.length - 1];
        }

        return this.selectedPath[this.selectedPath.length - 2];
    }

    private async buildSelectOptions(): Promise<Option[]> {
        if (!this.isLastPathARelation()) {
            return [];
        }

        const lastRelationPath = this.getLastRelationPath();

        let properties = await this.limetypeStore.getProperties(
            lastRelationPath.name
        );

        properties = Object.keys(properties).map(name => properties[name]);

        const options = properties
            .filter(property => property.type !== 'hasmany')
            .map(property => {
                return {
                    text: property.localname,
                    value: property.name,
                    relation: property.type === 'belongsto',
                };
            });

        return options;
    }

    private async handleSelectedProperty(event) {
        event.stopPropagation();

        const newPath: Path = {
            title: event.detail.text,
            name: event.detail.value,
            relation: event.detail.relation,
        };

        this.selectedPath = [...this.selectedPath, newPath];

        this.change.emit(this.buildSelectedPathString());

        this.currentOptions = await this.buildSelectOptions();
    }

    private handleDeletePath(event) {
        event.stopPropagation();

        const temp = [...this.selectedPath];
        temp.pop();
        this.selectedPath = temp;

        this.change.emit(this.buildSelectedPathString());
    }

    private buildSelectedPathString(): string | null {
        const pathString = this.selectedPath
            .slice(1)
            .reduce((cum, path, index, array) => {
                cum += path.name;

                if (index !== array.length - 1) {
                    cum += '.';
                }

                return cum;
            }, '');

        return pathString || null; // Return null if empty string
    }

    private async buildSelectedPathArray(): Promise<Path[]> {
        const pathArray = [
            {
                name: this.limetype,
                title: await this.limetypeStore.getTitle(this.limetype),
                relation: true,
            },
        ];
        let parentLimetype = this.limetype;
        for (const property of this.getValueDotNotationArray()) {
            pathArray.push({
                name: property,
                title: await this.limetypeStore.getPropertyTitle(
                    parentLimetype,
                    property
                ),
                relation: await this.limetypeStore.isRelationProperty(
                    parentLimetype,
                    property
                ),
            });

            parentLimetype = property;
        }

        return pathArray;
    }

    private getValueDotNotationArray() {
        const { formData } = this.fieldProps;
        if (formData === null || formData === undefined) {
            return [];
        }

        const arr = formData.split('.');

        if (arr.length === 1 && arr[0] === '') {
            return [];
        }

        return arr;
    }
}
