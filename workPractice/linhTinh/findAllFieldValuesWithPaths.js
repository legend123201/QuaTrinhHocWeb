/* 
Typescript version:
function findAllFieldsWithPaths(obj: any, fieldName: string): { value: any, path: string[] }[] {
  const results: { value: any, path: string[] }[] = [];

  function recursiveSearch(current: any, path: string[]) {
    if (typeof current !== 'object' || current === null) return;

    if (Array.isArray(current)) {
      for (let i = 0; i < current.length; i++) {
        recursiveSearch(current[i], [...path, i.toString()]);
      }
    } else {
      if (fieldName in current) {
        results.push({ value: current[fieldName], path: [...path, fieldName] });
      }

      for (const key of Object.keys(current)) {
        recursiveSearch(current[key], [...path, key]);
      }
    }
  }

  recursiveSearch(obj, []);

  return results;
}
*/

function findAllFieldValuesWithPaths(obj, fieldName) {
	const results = [];

	function recursiveSearch(current, path) {
		if (typeof current !== "object" || current === null) return;

		if (Array.isArray(current)) {
			for (let i = 0; i < current.length; i++) {
				recursiveSearch(current[i], [...path, i.toString()]);
			}
		} else {
			if (fieldName in current) {
				results.push({ value: current[fieldName], path: [...path, fieldName] });
			}

			for (const key of Object.keys(current)) {
				recursiveSearch(current[key], [...path, key]);
			}
		}
	}

	recursiveSearch(obj, []);

	return results;
}

const deepObject = {
	a: {
		b: {
			fingerprint: "fingerprint1"
		},
		list: [{ fingerprint: "fingerprint2" }, { somethingElse: "xxx" }, { nested: { fingerprint: "fingerprint3" } }]
	},
	fingerprint: "fingerprintRoot"
};

const allFingerprints = findAllFieldValuesWithPaths(deepObject, "fingerprint");

console.log(allFingerprints);
