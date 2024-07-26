export const getNextPermutation = (previous: number[], max: number): number[]|undefined => {
    for (let i = previous.length-1; i >= 0; i--) {
        if (previous[i]+1 < max+i+1-previous.length) {
            previous[i]++;
            for (let j = i+1; j < previous.length; j++) {
                previous[j] = previous[i] - i + j;
            }
            return previous;
        }
    }
    return undefined;
}