import { Parser, ParserFunc, Success } from './parser';

export class Macro {
    name: string;
    args: Array<string>;

    constructor(name: string, args: Array<string>) {
        this.name = name;
        this.args = args;
    }
}

type ParseResult = Macro | string;

export class MacroParser {
    message: string;

    constructor(message: string) {
        this.message = message;
    }

    private make_macro_parser = (name: string, arg_parser: ParserFunc) => {
        const dollar = Parser.char('$');
        const equal = Parser.char('=');
        const macro = Parser.string(name);
        return Parser.seq([dollar, macro, equal, arg_parser]);
    }

    private num = Parser.regex(/\d+/);
    private comma = Parser.char(',');
    private position = Parser.seq([this.num, this.comma, this.num]);

    private bool = Parser.choice([Parser.char('0'), Parser.char('1')])

    private imgplayer = this.make_macro_parser('imgplayer', this.position);
    private imgyesno = this.make_macro_parser('imgyesno', this.position);
    private hpmax = this.make_macro_parser('hpmax', this.num);
    private save = this.make_macro_parser('save', this.bool);

    private macro_parser = Parser.choice([
        this.imgplayer,
        this.imgyesno,
        this.hpmax,
        this.save,
    ]);

    parse: () => ParseResult = () => {
        const parse_result = this.macro_parser(this.message, 0);
        if (parse_result instanceof Success) {
            const macro_name: string = parse_result.result[1];
            const raw_args = parse_result.result[3];
            if (raw_args instanceof Array) {
                const macro_args = raw_args.filter((c: string) => c !== ",");
                return new Macro(macro_name, macro_args);
            } else {
                return new Macro(macro_name, [raw_args]);
            }
            
        } else {
            return this.message;
        }
    }
}