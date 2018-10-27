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

    // 記号
    private comma = Parser.char(',');

    // 引数にとる値
    private num = Parser.regex(/\d+/);
    private bool = Parser.choice([Parser.char('0'), Parser.char('1')]);
    private item_range = Parser.regex(/^(1[0-2]|[0-9])/);
    private parts_type = this.bool;
    private eol = Parser.regex(/$/);
    private parts_x = Parser.regex(/^(10|[1-9])/);
    private color_type = Parser.regex(/[0-2]|4/);
    private color_range = Parser.regex(/2[0-5][0-5]|1[0-9][0-9]|[1-9][0-9]|[0-9]/)

    // 引数のパターン
    private position = Parser.seq([this.num, this.comma, this.num, this.eol]);
    private num_eol = Parser.seq([this.num, this.eol]);
    private bool_eol = Parser.seq([this.bool, this.eol]);
    private set_item = Parser.seq([this.item_range, this.comma, this.num, this.eol]);
    private replace_parts = Parser.choice(
        [
            Parser.seq([this.num, this.comma, this.num, this.comma, this.parts_type, this.eol]),
            Parser.seq([this.num, this.comma, this.num, this.eol]),
        ]
    );
    private face_args = Parser.seq([
        this.num, this.comma, this.num, this.comma,
        this.parts_x, this.comma, this.num, this.comma,
        this.num, this.comma, this.num_eol,
    ]);
    private imgclick_args = Parser.choice([
        Parser.seq([Parser.char('0'), this.eol]),
        Parser.seq([this.parts_x, this.comma, this.num_eol]),
    ]);
    private color_args = Parser.seq([
        this.color_type, this.comma,
        this.color_range, this.comma,
        this.color_range, this.comma,
        this.color_range, this.eol,
    ]);
    private dirmap_args = Parser.choice([
        Parser.seq([this.num, this.comma, this.num, this.comma, this.parts_type, this.eol]),
        Parser.seq([this.num, this.comma, this.num_eol]),
    ]);
    private map_args = Parser.choice([
        Parser.seq([this.num, this.comma, this.num, this.comma, this.num, this.comma, this.parts_type, this.eol]),
        Parser.seq([this.num, this.comma, this.num, this.comma, this.num_eol]),
    ]);
    // ToDo: 第一引数の値の制限
    private imgframe_args = Parser.seq([
        this.num, this.comma, this.parts_x, this.comma, this.num_eol,
    ]);
    private imgbom_args = Parser.seq([
        this.parts_x, this.comma, this.num_eol,
    ]);

    // 各マクロのパーサ
    private imgplayer = this.make_macro_parser('imgplayer', this.position);
    private imgyesno = this.make_macro_parser('imgyesno', this.position);
    private hpmax = this.make_macro_parser('hpmax', this.num_eol);
    private save = this.make_macro_parser('save', this.bool_eol);
    private item = this.make_macro_parser('item', this.set_item);
    private default = this.make_macro_parser('default', this.bool_eol);
    private oldmap = this.make_macro_parser('oldmap', this.bool_eol);
    private parts = this.make_macro_parser('parts', this.replace_parts);
    private move = this.make_macro_parser('move', this.num_eol);
    private face = this.make_macro_parser('face', this.face_args);
    private delplayer = this.make_macro_parser('delplayer', this.bool_eol);
    private imgclick = this.make_macro_parser('imgclick', this.imgclick_args);
    private color = this.make_macro_parser('color', this.color_args);
    private gameover = this.make_macro_parser('gameover', this.position);
    private dirmap = this.make_macro_parser('dirmap', this.dirmap_args);
    private map = this.make_macro_parser('map', this.map_args);
    private imgframe = this.make_macro_parser('imgframe', this.imgframe_args);
    private imgbom = this.make_macro_parser('imgbom', this.imgbom_args);

    private macro_parser = Parser.choice([
        this.imgplayer,
        this.imgyesno,
        this.hpmax,
        this.save,
        this.item,
        this.default,
        this.oldmap,
        this.parts,
        this.move,
        this.face,
        this.delplayer,
        this.imgclick,
        this.color,
        this.gameover,
        this.dirmap,
        this.map,
        this.imgframe,
        this.imgbom,
    ]);

    parse: () => ParseResult = () => {
        const parse_result = this.macro_parser(this.message, 0);
        if (parse_result instanceof Success) {
            // マクロ名と引数に分解
            const macro_name: string = parse_result.result[1];
            const raw_args: Array<Array<string>> = parse_result.result[3];
            // 結果の返却
            // 引数はネストされて出てくるのでフラットにしてからカンマを除去
            // 行末の終端記号もパースされるので除去しておく
            const macro_args = raw_args.reduce(
                (acc, val) => acc.concat(val), []
            ).slice(0, -1).filter((c: string) => c !== ",");
            return new Macro(macro_name, macro_args);
        } else {
            // パースに失敗したときは入ってきた文字列をそのまま返す
            return this.message;
        }
    }
}