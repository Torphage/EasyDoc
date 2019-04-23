export {};

declare global {

    /**
     * The String type in Typescript.
     *
     * @interface String
     */
    interface String {       

        /**
         * Returns the position of the first occurrence of a regular expression pattern.
         *
         * @param {RegExp} regexp The regular expression pattern to search for in the string.
         * @param {number} [position] The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
         * @returns {number}
         * @memberof String
         */
        regexIndexOf(regexp: RegExp, position?: number): number;

        /**
         * Returns the last occurrence of a regular expression pattern in the string.
         *
         * @param {RegExp} regexp The regular expression pattern to search for.
         * @param {number} [position] The index at which to begin searching. If omitted, the search begins at the end of the string.
         * @returns {number}
         * @memberof String
         */
        regexLastIndexOf(regexp: RegExp, position?: number): number
    }
}