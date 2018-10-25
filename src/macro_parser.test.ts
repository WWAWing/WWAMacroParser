import { MacroParser, Macro } from './macro_parser';

describe('parse macros', () => {
    const messages = [
        '$imgplayer=1,2',
        '$imgyesno=4,5',
        'this is message!',
    ];
    const results = messages.map(message => new MacroParser(message).parse());

    it('check imgplayer', () => {
        expect(results[0]).toEqual(new Macro('imgplayer', ['1', '2']));
    });
    it('check imgyesno', () => {
        expect(results[1]).toEqual(new Macro('imgyesno', ['4', '5']));
    });
    it('check message', () => {
        expect(results[2]).toEqual('this is message!');
    });
});

describe('parse imgplayer', () => {
    it('success', () => {
        const message = '$imgplayer=1,2';
        expect(new MacroParser(message).parse()).toEqual(new Macro('imgplayer', ['1', '2']));
    });
    it('failure', () => {
        const message = '$imgplayer=1';
        expect(new MacroParser(message).parse()).toEqual(message);
    });
});

describe('parse imgyesno', () => {
    it('success', () => {
        const message = '$imgyesno=1,2';
        expect(new MacroParser(message).parse()).toEqual(new Macro('imgyesno', ['1', '2']));
    });
    it('failure', () => {
        const message = '$imgyesno=1';
        expect(new MacroParser(message).parse()).toEqual(message);
    });
});

describe('parse hpmax', () => {
    it('success', () => {
        const message = '$hpmax=1';
        expect(new MacroParser(message).parse()).toEqual(new Macro('hpmax', ['1']));
    });
    it('failure', () => {
        const message = '$hpmax=hoge';
        expect(new MacroParser(message).parse()).toEqual(message);
    });
});

describe('parse save', () => {
    it('success', () => {
        let message = '$save=0';
        expect(new MacroParser(message).parse()).toEqual(new Macro('save', ['0']));
        message = '$save=1';
        expect(new MacroParser(message).parse()).toEqual(new Macro('save', ['1']));
    });
    it('failure', () => {
        const message = '$save=2';
        expect(new MacroParser(message).parse()).toEqual(message);
    });
});

describe('parse item', () => {
    it('success', () => {
        let message = '$item=0,5';
        expect(new MacroParser(message).parse()).toEqual(new Macro('item', ['0', '5']));
        message = '$item=11,90';
        expect(new MacroParser(message).parse()).toEqual(new Macro('item', ['11', '90']));
    });
    it('failure', () => {
        const message = '$item=23,5';
        expect(new MacroParser(message).parse()).toEqual(message);
    });
});

describe('parse default', () => {
    const name = 'default';
    it('success', () => {
        let message = '$default=0';
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        message = '$default=1';
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(`$${name}=2`);
    });
});

describe('parse oldmap', () => {
    const name = 'oldmap';
    it('success', () => {
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(`$${name}=2`);
    });
});