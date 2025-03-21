module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    }
  };
  