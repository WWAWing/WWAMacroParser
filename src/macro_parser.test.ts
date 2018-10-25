import { MacroParser, Macro } from './macro_parser';

describe('parse macros', () => {
    const messages = [
        '$imgplayer=1,2',
        '$imgyesno=4,5',
        'this is message!',
    ];
    const results = messages.map(message => new MacroParser(message).parse());

    it('check imgplayer', () => {
        expect(results[0]).toEqual(new Macro('imgplayer', [1, 2]));
    });
    it('check imgyesno', () => {
        expect(results[1]).toEqual(new Macro('imgyesno', [4, 5]));
    });
    it('check message', () => {
        expect(results[2]).toEqual('this is message!');
    });
});