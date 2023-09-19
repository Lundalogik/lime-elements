export interface Icon {
    /**
     * Name of the icon, refers to the icon's filename in lime-icons8 repository.
     */
    name: string;

    /**
     * Color of the icon.
     */
    color?: string;

    /**
     * Background color of the icon.
     */
    backgroundColor?: string;

    /**
     * The `title` attribute of the icon.
     * Used primarily to improve accessibility for users who
     * take advantage of assistive technologies; but also
     * to clarify further what an icon tries to resemble
     * for sighted users.
     */
    title?: string;
}
