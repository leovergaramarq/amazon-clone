export default  {
    preset: "@shelf/jest-mongodb",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    // the following line is needed in order to grab modules from the
    // src folder without the need to write them relatively
    moduleDirectories: ["node_modules", "src"],
  };