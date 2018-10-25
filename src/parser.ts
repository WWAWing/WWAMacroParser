export class Success {
    result: any;
    position: number;

    constructor(result: any, position: number) {
        this.result = result;
        this.position = position;
    }
}

export class Failure {
    position: number;

    constructor(position: number) {
        this.position = position;
    }
}

type ParseResult = Success | Failure;
export type ParserFunc = (target: string, position: number) => ParseResult

export class Parser {
    static string = (str: string) => {
        const len = str.length;
        return (target: string, position: number) => {
            if (target.substr(position, len) === str) {
                return new Success(str, len + position);
            } else {
                return new Failure(position);
            }
        }
    }

    static repeat = (parser: ParserFunc) => {
        return (target: string, position: number) => {
            const results: Array<any> = [];
            while (true) {
                const parsed = parser(target, position);
                if (parsed instanceof Success) {
                    results.push(parsed.result);
                    position = parsed.position;
                } else {
                    break;
                }
            }
            return new Success(results, position);
        }
    }

    static choice = (parsers: Array<ParserFunc>) => {
        return (target: string, position: number) => {
            for (let parser of parsers) {
                const parsed = parser(target, position);
                if (parsed instanceof Success) {
                    return parsed;
                }
            }

            return new Failure(position);
        };
    }

    static seq = (parsers: Array<ParserFunc>) => {
        return (target: string, position: number) => {
            const results = [];
            for (let parser of parsers) {
                const parsed = parser(target, position);
                if (parsed instanceof Success) {
                    results.push(parsed.result);
                    position = parsed.position;
                } else {
                    return new Failure(position);
                }
            }
            return new Success(results, position);
        };
    }

    static option = (parser: ParserFunc) => {
        return (target: string, position: number) => {
            const result = parser(target, position);
            if (result instanceof Success) {
                return result;
            } else {
                return new Success(null, position);
            }
        }
    }

    static regex = (regexp: RegExp) => {
        if (regexp.source.substring(0, 1) !== '^') {
            regexp = new RegExp(
                '^' + regexp.source,
                (regexp.global ? 'g' : '') +
                (regexp.ignoreCase ? 'i' : '') +
                (regexp.multiline ? 'm' : '')
            );
        }

        return (target: string, position: number) => {
            regexp.lastIndex = 0;
            const result = regexp.exec(target.slice(position));
            if (result) {
                position += result[0].length;
                return new Success(result[0], position);
            } else {
                return new Failure(position)
            }
        }
    }

    static char = (str: string) => {
        const dict: {[index: string]: string} = {};
        for (let c of str) {
            dict[c] = c;
        }
        return (target: string, position: number) => {
            const char = target.substr(position, 1);
            if (dict[char]) {
                return new Success(char, position + 1);
            } else {
                return new Failure(position);
            }
        }
    }
}