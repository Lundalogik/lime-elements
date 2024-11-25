export declare class Search {
  /**
   * Index containing searchable documents
   */
  index: any;
  private documents;
  private host;
  constructor();
  componentDidLoad(): void;
  render(): HTMLElement;
  private renderDocument;
  private handleChangeInput;
  private search;
  private handleLinkClick;
}
