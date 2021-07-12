// You can only use lodash
// import _ from 'lodash'

const preprocessPattern = (pattern: any) => {
  // adds . between each [*][*] and each [character][], in order to consider each a seprate step
  return pattern.replace(/([a-z])\[/g, "$1.[").replace(/]\[/g, "].[");
};

export default function listPathsByPattern<T extends object>(
  _token: T | Array<T>,
  inputPattern: string
): Array<string> {
  // outer scope result holder
  let result: any = [];

  // initializations
  const _pattern = preprocessPattern(inputPattern).split(".");
  const addTo: number[] = [];

  const getAllRec = (
    pattern: string[],
    token: any,
    addTo: number[],
    currentResult: (string | undefined)[]
  ) => {
    // closure function using the `currentResult` outer scope variable
    // recursively computes all correct paths to pattern for a given token

    if (pattern.length !== 0) {
      // stop computing paths when pattern is empty
      const head = pattern[0]; // extract the current part of the pattern to apply
      if (head.includes("*")) {
        // if current pattern is an array
        const currResLength = currentResult.length;
        for (let i = 0; i < token.length; i++) {
          let _currResLength = [...currentResult];
          // access element and push path
          if (currentResult.length == 0) {
            _currResLength.push(`[${i}]`);
            // continue the computation on a subset of the problem
            getAllRec(
              pattern.slice(1),
              token[i],
              [_currResLength.length - 1, ...addTo],
              [..._currResLength]
            );
          } else {
            _currResLength = _currResLength.map(
              (element) => element + `[${i}]`
            );
            // continue the computation on a subset of the problem
            getAllRec(
              pattern.slice(1),
              token[i],
              [_currResLength.length - 1, ...addTo],
              [..._currResLength]
            );
          }
        }
      } else {
        // if current pattern is an object
        if (token[head] !== undefined) {
          // only treat correct paths
          // access element and push path
          if (currentResult.length == 0) currentResult.push(`${head}`);
          else
            currentResult = currentResult.map((element:  string | undefined, idx: number) => {
              if (addTo.includes(idx)) return element + `.${head}`;
            });
          // continue the computation on a subset of the problem
          getAllRec(pattern.slice(1), token[head], addTo, [...currentResult]);
        } else {
          // remove path if it's uncorrect for the current token
          currentResult = currentResult.map((e: string | undefined, idx: number) => {
            // TODO make this a filter
            if (!addTo.includes(idx)) {
              return e;
            }
          });
        }
      }
    } else {
      result = [...result, ...currentResult];
    }
  };

  // call rec function
  getAllRec(_pattern, _token, addTo, []);
  // filter uncorrect paths
  result = result.filter((e : string | undefined) => e != undefined && !e.includes('undefined'))

  return result;
}
