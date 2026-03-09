/**
 * Calculates the hypergeometric probability: P(X = k)
 * The probability of exactly k successes in n draws, from a population of size N with K successes.
 */
export function hypergeometricProbability(k: number, n: number, K: number, N: number): number {
    return (combinations(K, k) * combinations(N - K, n - k)) / combinations(N, n);
}

/**
 * Calculates the cumulative hypergeometric probability: P(X >= k)
 */
export function cumulativeHypergeometricProbability(k: number, n: number, K: number, N: number): number {
    let probability = 0;
    for (let i = k; i <= Math.min(n, K); i++) {
        probability += hypergeometricProbability(i, n, K, N);
    }
    return probability;
}

function combinations(n: number, k: number): number {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k;
    
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result = result * (n - i + 1) / i;
    }
    return result;
}
