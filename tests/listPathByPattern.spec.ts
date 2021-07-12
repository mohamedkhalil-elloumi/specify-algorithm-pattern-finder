import listPathsByPattern from "../src";
import _ from "lodash";

async function seeds() {
  return (await import("./seeds.json")).default;
}

describe("List path by pattern", () => {
  it("Should return as many elements as there are in the shadow array", async (done) => {
    const tokens: Array<Payload> = await seeds();
    const pattern = "value[*].blur.value.measure";
    const expected = [
      ["value[0].blur.value.measure"],
      ["value[0].blur.value.measure", "value[1].blur.value.measure"],
      [
        "value[0].blur.value.measure",
        "value[1].blur.value.measure",
        "value[2].blur.value.measure",
        "value[3].blur.value.measure",
        "value[4].blur.value.measure",
        "value[5].blur.value.measure",
      ],
    ];

    tokens
      .filter(({ type }) => type === "shadow")
      .forEach((token, index) => {
        const result = listPathsByPattern(token, pattern);
        expect((token.value as Array<Payload>).length).toEqual(result.length);
        expect(result).toEqual(expected[index]);
      });
    done();
  });

  it("Should return as many elements as there are in the shadow array", async (done) => {
    const tokens: Array<Payload> = await seeds();
    const pattern = "value[*].blur.value.measure";
    tokens
      .filter(({ type }) => type === "shadow")
      .forEach((token) => {
        const result = listPathsByPattern(token, pattern);
        expect((token.value as Array<Payload>).length).toEqual(result.length);
        result.forEach((elm, index) => {
          expect(elm).toEqual(pattern.replace("[*]", `[${index}]`));
        });
      });
    done();
  });

  it("Should loop over multiple array and return as many element as there are in the payload ", async (done) => {
    const pattern = "[*][*].name";
    const customSeeds = [
      [
        {
          name: 1,
        },

        {
          name: 2,
        },
      ],
      [
        {
          name: 3,
        },

        {
          name: 4,
        },
      ],
    ];
    const result = listPathsByPattern(customSeeds, pattern);
    expect(result.length).toEqual(customSeeds.flat(2).length);
    result.forEach((path, index) =>
      expect(_.get(customSeeds, path)).toEqual(index + 1)
    );
    done();
  });
  // Write your own tests
  it("Should loop through the array and access the foo key then go to the a key and loop through the array to return the full correct pattern", async (done) => {
    const pattern = "[*].foo.a[*].bar";
    const token = [
      {
        a: 2,
      },
      {
        foo: {
          a: [
            {
              bar: "value",
            },
          ],
        },
      },
      {
        a: 3,
      },
    ];
    const result = listPathsByPattern(token, pattern);
    const expectedResult = ["[1].foo.a[0].bar"];
    expect(result).toEqual(expectedResult);
    done();
  });

  it("Should access the token key element and loop through the array and repeat the same access to find the correct pattern", async (done) => {
    const pattern = "a[*].foo.a[*].bar";
    const token = {
      a: [
        {
          a: 2,
        },
        {
          foo: {
            a: [
              {
                bar: "value",
              },
            ],
          },
        },
        {
          a: 3,
        },
      ],
    };
    const result = listPathsByPattern(token, pattern);
    const expectedResult = ["a[1].foo.a[0].bar"];
    expect(result).toEqual(expectedResult);
    done();
  });

  it("Should loop through the array of objects to look for the pattern", async (done) => {
    const pattern = "[*].foo[*].bar";
    const token = [
      {
        a: 2,
      },
      {
        foo: [
          {
            bar: "value",
          },
        ],
      },
      {
        a: 3,
      },
      {
        foo: [
          {
            baz: "wrong path",
          },
          {
            bar: "value",
          },
        ],
      },
    ];
    const result = listPathsByPattern(token, pattern);
    const expectedResult = ["[1].foo[0].bar", "[3].foo[1].bar"];
    expect(result).toEqual(expectedResult);
    done();
  });

  it("should loop through the matrix to find the bar key and loop through the array to find foo", async (done) => {
    const pattern = "[*][*].bar[*].foo";
    const token = [
      [
        {
          bar: 1,
        },
        {
          foo: 1,
        },
      ],
      [
        {
          foo: 1,
        },
        {
          bar: [
            {
              foo: 2,
            },
          ],
        },
      ],
    ];
    const result = listPathsByPattern(token, pattern);
    const expectedResult = ["[1][1].bar[0].foo"];
    expect(result).toEqual(expectedResult);
    done();
  });
});
