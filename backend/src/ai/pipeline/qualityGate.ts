type QualityResult = {
    pass: boolean;
    reason?: string;
  };
  
  export function qualityGate(
    data: any,
    rules: {
      requiredFields: string[];
      minLengths?: Record<string, number>;
    }
  ): QualityResult {
    if (!data || typeof data !== "object") {
      return { pass: false, reason: "Output is not an object" };
    }
  
    for (const field of rules.requiredFields) {
      if (!(field in data)) {
        return { pass: false, reason: `Missing field: ${field}` };
      }
  
      const value = data[field];
      if (value === null || value === undefined) {
        return { pass: false, reason: `Empty field: ${field}` };
      }
  
      if (typeof value === "string" && value.trim().length === 0) {
        return { pass: false, reason: `Blank string: ${field}` };
      }
    }
  
    if (rules.minLengths) {
      for (const [field, min] of Object.entries(rules.minLengths)) {
        if (
          typeof data[field] === "string" &&
          data[field].length < min
        ) {
          return {
            pass: false,
            reason: `${field} too short (min ${min})`,
          };
        }
      }
    }
  
    return { pass: true };
  }
  