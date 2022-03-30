export enum LoadingResult {
    /**
     * Indicate loading successful
     */
    SUCCESS = 'success',

    /**
     * Indicate loading unsuccessful
     */
    FAILURE = 'failure',

    /**
     * Stop loading indication, without indicating either success or failure.
     * This might be used if the user cancels the loading, for example.
     */
    ABORT = 'abort',
}

export interface LoadingButtonInteraction {
    /**
     * Call to indicate loading is in progress.
     */
    indicateLoading: () => void;

    /**
     * Call to indicate loading has stopped.
     */
    resolveLoading: (result: LoadingResult) => void;
}
