# Specify Algorithm Test

This repository holds a proposed solution to extract the correct paths that matchs a specific pattern for a given object or array of objects.

## Algorithm steps

1. Preprocess pattern: add . between each [*][*] and each [character][]
    This is done in order to consider each of the above separate keys/indexes ( keys/indexes are separated by . )

2. Extract keys/indexes from pattern (split .) and store them in patterns array

3. If patterns array is empty move to step 7 
    
4. If head is an index ([*]) append all possible indexes ([0], [1], ..., [i], ...) and return to step 3 with patterns = patterns.tail (remove the first element) and token = token[i]

5. else If head is a key and the key is defined in the token object, append key to the current local results and return to step 3 with patterns.tail (remove the first element) and token = token[key]

6. else if head is key and key is not defined in the token object, remove the leading path from local results

7. append local results to global result

(3,4,5,6) are steps of a recursive function

## Run test

```bash
#unit tests
npm run test
```



