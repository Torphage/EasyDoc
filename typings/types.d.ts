export {};

declare global {
    interface String {
        /**
          * Returns the position of the first occurrence of a regular expression pattern.
          * @param regexp The regular expression pattern to search for in the string
          * @param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
          */        
        regexIndexOf(regexp: RegExp, position?: number): number;

        /**
          * Returns the last occurrence of a regular expression pattern in the string.
          * @param regexp The regular expression pattern to search for.
          * @param position The index at which to begin searching. If omitted, the search begins at the end of the string.
          */
        regexLastIndexOf(regexp: RegExp, position?: number): number
    }
}