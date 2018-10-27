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
        expect(new MacroParser(`$${name}=2,`).parse()).toEqual(`$${name}=2,`);
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
        expect(new MacroParser(`$${name}=2,3`).parse()).toEqual(`$${name}=2,3`);
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(`$${name}=2`);
    });
});

describe('parse parts', () => {
    const name = 'parts';
    it('success', () => {
        expect(new MacroParser(`$${name}=4,10`).parse()).toEqual(new Macro(name, ['4', '10']));
        expect(new MacroParser(`$${name}=9,72,0`).parse()).toEqual(new Macro(name, ['9', '72', '0']));
        expect(new MacroParser(`$${name}=6,15,1`).parse()).toEqual(new Macro(name, ['6', '15', '1']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=4,10,`).parse()).toEqual(`$${name}=4,10,`);
        expect(new MacroParser(`$${name}=9,72,2`).parse()).toEqual(`$${name}=9,72,2`);
    });
});

describe('parse face', () => {
    const name = 'face';
    it('success', () => {
        expect(new MacroParser(`$${name}=100,110,5,10,1,1`).parse()).toEqual(new Macro(name, ['100', '110', '5', '10', '1', '1']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=100,110,5,10,1`).parse()).toEqual(`$${name}=100,110,5,10,1`);
        expect(new MacroParser(`$${name}=100,110,5,10,1,1,2`).parse()).toEqual(`$${name}=100,110,5,10,1,1,2`);
    });
});

describe('parse delplayer', () => {
    const name = 'delplayer';
    it('success', () => {
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=2,3`).parse()).toEqual(`$${name}=2,3`);
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(`$${name}=2`);
    });
});

describe('parse color', () => {
    const name = 'color';
    it('success', () => {
        expect(new MacroParser(`$${name}=0,255,255,255`).parse()).toEqual(new Macro(name, ['0', '255', '255', '255']));
        expect(new MacroParser(`$${name}=1,0,0,0`).parse()).toEqual(new Macro(name, ['1', '0', '0', '0']));
        expect(new MacroParser(`$${name}=2,123,123,123`).parse()).toEqual(new Macro(name, ['2', '123', '123', '123']));
        expect(new MacroParser(`$${name}=4,53,53,53`).parse()).toEqual(new Macro(name, ['4', '53', '53', '53']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=3,255,255,255`).parse()).toEqual(`$${name}=3,255,255,255`);
        expect(new MacroParser(`$${name}=5,255,255,255`).parse()).toEqual(`$${name}=5,255,255,255`);
        expect(new MacroParser(`$${name}=0,256,256,256`).parse()).toEqual(`$${name}=0,256,256,256`);
        expect(new MacroParser(`$${name}=0,-1,-1,-1`).parse()).toEqual(`$${name}=0,-1,-1,-1`);
    });
});

describe('parse gameover', () => {
    const name = 'gameover';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,2`).parse()).toEqual(new Macro(name, ['1', '2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(`$${name}=1`);
    });
});

describe('parse dirmap', () => {
    const name = 'dirmap';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,2`).parse()).toEqual(new Macro(name, ['1', '2']));
        expect(new MacroParser(`$${name}=1,2,0`).parse()).toEqual(new Macro(name, ['1', '2', '0']));
        expect(new MacroParser(`$${name}=1,2,1`).parse()).toEqual(new Macro(name, ['1', '2', '1']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,2,2`).parse()).toEqual(`$${name}=1,2,2`);
        expect(new MacroParser(`$${name}=1,2,`).parse()).toEqual(`$${name}=1,2,`);
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(`$${name}=1`);
    });
});