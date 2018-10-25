import { Parser, Success, Failure } from './parser';

describe('test string parse', () => {
    const parse = Parser.string('hoge');
    it('success', () => {
        expect(parse('hoge', 0)).toEqual(new Success('hoge', 4));
    });
    it('failure', () => {
        expect(parse('fugafuga', 0)).toEqual(new Failure(0));
    });
});

describe('test repeat parse', () => {
    const parse = Parser.string('hoge');
    const repeat_parse = Parser.repeat(parse);
    it('success', () => {
        expect(repeat_parse('hogehoge', 0)).toEqual(new Success(['hoge', 'hoge'], 8));
        expect(repeat_parse('hogefuga', 0)).toEqual(new Success(['hoge'], 4));
        expect(repeat_parse('fugafuga', 0)).toEqual(new Success([], 0));
    });
});

describe('test choice parse', () => {
    const parse_hoge = Parser.string('hoge');
    const parse_fuga = Parser.string('fuga');
    const choice_parse = Parser.choice([parse_hoge, parse_fuga]);
    it('success', () => {
        expect(choice_parse('hoge', 0)).toEqual(new Success('hoge', 4));
        expect(choice_parse('fuga', 0)).toEqual(new Success('fuga', 4));
        expect(choice_parse('hogefuga', 0)).toEqual(new Success('hoge', 4));
    });
});

describe('test repeat choice parse', () => {
    const parse_hoge = Parser.string('hoge');
    const parse_fuga = Parser.string('fuga');
    const choice_parse = Parser.choice([parse_hoge, parse_fuga]);
    const repeat_choice_parse = Parser.repeat(choice_parse);
    it('success', () => {
        expect(repeat_choice_parse('hoge', 0)).toEqual(new Success(['hoge'], 4));
        expect(repeat_choice_parse('fuga', 0)).toEqual(new Success(['fuga'], 4));
        expect(repeat_choice_parse('hogefugahogefuga', 0)).toEqual(new Success(['hoge', 'fuga', 'hoge', 'fuga'], 16));
    });
});

describe('test seq parse', () => {
    const parse_hoge = Parser.string('hoge');
    const parse_fuga = Parser.string('fuga');
    const parse_piyo = Parser.string('piyo');
    const seq_parse = Parser.seq([parse_hoge, parse_fuga, parse_piyo]);
    it('success', () => {
        expect(seq_parse('hogefugapiyo', 0)).toEqual(new Success(['hoge', 'fuga', 'piyo'], 12));
    });
    it('failure', () => {
        expect(seq_parse('hogepiyo', 0)).toEqual(new Failure(4));
    });
});

describe('test seq choice parse', () => {
    const parse_hoge = Parser.string('hoge');
    const parse_fuga = Parser.string('fuga');
    const parse_piyo = Parser.string('piyo');
    const choice_parse = Parser.choice([parse_fuga, parse_piyo])
    const seq_choice_parse = Parser.seq([parse_hoge, choice_parse]);
    it('success', () => {
        expect(seq_choice_parse('hogefuga', 0)).toEqual(new Success(['hoge', 'fuga'], 8));
        expect(seq_choice_parse('hogepiyo', 0)).toEqual(new Success(['hoge', 'piyo'], 8));
    });
});

describe('test option parse', () => {
    const parse_hoge = Parser.string('hoge');
    const option_parse = Parser.option(parse_hoge);
    it('success', () => {
        expect(option_parse('hoge', 0)).toEqual(new Success('hoge', 4));
        expect(option_parse('fuga', 0)).toEqual(new Success(null, 0));
    });
});

describe('test regex parse', () => {
    const parse_hoge = Parser.regex(/hoge/);
    const parse_no_zero_start_number = Parser.regex(/([1-9][0-9]*)/);
    it('success', () => {
        expect(parse_hoge('hoge', 0)).toEqual(new Success('hoge', 4));
        expect(parse_no_zero_start_number('2018', 0)).toEqual(new Success('2018', 4));
    });
    it('failure', () => {
        expect(parse_hoge('fuga', 0)).toEqual(new Failure(0));
        expect(parse_no_zero_start_number('018', 0)).toEqual(new Failure(0));
    });
});

describe('test char parse', () => {
    const parse_a = Parser.char('a');
    it('success', () => {
        expect(parse_a('abcdef', 0)).toEqual(new Success('a', 1));
    });
    it('failure', () => {
        expect(parse_a('defgh', 0)).toEqual(new Failure(0));
    });
});

describe('test comma separated numbers', () => {
    const num = Parser.regex(/\d+/);
    const comma = Parser.char(',');
    const position = Parser.seq([num, comma, num]);
    it('success', () => {
        expect(position('1,2', 0)).toEqual(new Success(['1', ',', '2'], 3));
    });
});

describe('test parse macro', () => {
    const num = Parser.regex(/\d+/);
    const comma = Parser.char(',');
    const position = Parser.seq([num, comma, num]);
    const dollar = Parser.char('$');
    const macro = Parser.string('macro_name');
    const equal = Parser.char('=');
    const macro_parser = Parser.seq([dollar, macro, equal, position]);
    it('success', () => {
        expect(macro_parser('$macro_name=1,2', 0)).toEqual(new Success(['$', 'macro_name', '=', ['1', ',', '2']], 15));
    });
});