import log from "loglevel";

if (process.env.NODE_ENV === "production") {
  log.setLevel("warn");
} else {
  log.setLevel("debug");
}

export default log;