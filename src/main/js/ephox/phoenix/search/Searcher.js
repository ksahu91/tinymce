define(
  'ephox.phoenix.search.Searcher',

  [
    'ephox.boss.api.DomUniverse',
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.phoenix.data.Spot',
    'ephox.phoenix.ghetto.search.GhettoMatchSplitter',
    'ephox.phoenix.group.DomGroup',
    'ephox.phoenix.search.Safe',
    'ephox.phoenix.search.Sleuth',
    'ephox.phoenix.util.arr.PositionArray',
    'ephox.phoenix.util.doc.List',
    'ephox.scullion.Struct',
    'ephox.sugar.api.Text'
  ],

  function (DomUniverse, Arr, Option, Spot, GhettoMatchSplitter, DomGroup, Safe, Sleuth, PositionArray, List, Struct, Text) {

    var WordPattern = Struct.immutable('word', 'pattern');
    var universe = DomUniverse();
    
    var gen = function (input) {
      return PositionArray.make(input, function (x, offset) {
        var finish = offset + Text.get(x).length;
        return Option.from(Spot.range(x, offset, finish));
      });
    };

    var run = function (elements, patterns) {
      var sections = DomGroup.group(elements);
      var result = Arr.bind(sections, function (x) {
        var input = List.justText(x);
        var text = Arr.map(input, Text.get).join('');

        var matches = Sleuth.search(text, patterns);
        var structure = gen(input);

        return GhettoMatchSplitter.separate(universe, structure, matches);
      });

      return result;
    };

    var safeWords = function (elements, words) {
      var patterns = Arr.map(words, function (x) {
        var pattern = Safe.word(x);
        return WordPattern(x, pattern);
      });
      return run(elements, patterns);
    };

    var safeToken = function (elements, token) {
      var pattern = WordPattern(token ,Safe.token(token));
      return run(elements, [pattern]);
    };

    return {
      safeWords: safeWords,
      safeToken: safeToken,
      run: run
    };
  }
);
