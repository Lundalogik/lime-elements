import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'limel-data-table',
  styleUrl: 'data-table.scss',
  shadow: true,
})
export class LimelDataTable implements ComponentInterface {
    /**
     * Label to display in the header
     */
    @Prop({ reflectToAttr: true })
    public field: any;

    render() {
    return (
      <div class="mdc-data-table">
        <table class="mdc-data-table__table" aria-label="">
          <thead>
            <tr class="mdc-data-table__header-row">
                {this.field.header.map(header => this.getHeaders(header))}
            </tr>
          </thead>
          <tbody class="mdc-data-table__content">
            <tr class="mdc-data-table__row">
                {this.field.body.map(bodyCell => this.getBody(bodyCell))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  private getHeaders(header: string | number){
      return(
          <th class="mdc-data-table__header-cell" role="columnheader" scope="col">{header}</th>
      )
  }

  private getBody(bodyCell: any){
      return (
          <td class="mdc-data-table__cell">{bodyCell}</td>
      )
  }

}
