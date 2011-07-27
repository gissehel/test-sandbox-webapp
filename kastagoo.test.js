(function() {
  var camelcase, capitalize, kastagoo;
  kastagoo = this.kastagoo = this.kastagoo || require("kastagoo.utils.coffee").kastagoo;
  capitalize = function(name) {
    return name.toUpperCase().substr(0, 1) + name.substr(1);
  };
  camelcase = function(name) {
    var x;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = name.replace(/[^a-zA-Z0-9]+/ig, " ").split(" ");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push(capitalize(x));
      }
      return _results;
    })()).join("");
  };
  kastagoo.utils.update(kastagoo, {
    test: {
      camelcase: camelcase,
      capitalize: capitalize,
      runtests: function(tests, fixtures) {
        var arglen, current_fixture_name, current_index, expected_result, fixture, fixture_name, last_data_parts, line, method_name, method_parts, missing, obtained_result, part, parts, prefix, reason, result, stats, value_parts, x, _i, _j, _len, _len2, _ref;
        current_fixture_name = null;
        missing = {};
        stats = {
          success: 0,
          fail: 0
        };
        for (_i = 0, _len = tests.length; _i < _len; _i++) {
          line = tests[_i];
          line = line.replace(/^[\s\t]+/g, "");
          line = line.replace(/\*/g, "**star**").replace(/\\\|/g, "**pipe**");
          if (line.substr(0, 1) === "|") {
            parts = ((function() {
              var _i, _len, _ref, _results;
              _ref = line.split("|");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                part = _ref[_i];
                _results.push(part.replace(/^[\s\t]+/g, "").replace(/[\s\t]+$/g, ""));
              }
              return _results;
            })()).slice(1);
            parts = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = parts.length; _i < _len; _i++) {
                part = parts[_i];
                _results.push(part.replace(/\*\*pipe\*\*/g, "|").replace(/\*\*star\*\*/g, "*"));
              }
              return _results;
            })();
            if (parts.length > 0) {
              if (parts[parts.length - 1] === '') {
                parts = parts.slice(0, parts.length - 1);
              }
              prefix = parts[0].toLowerCase();
              switch (prefix) {
                case "do with":
                  current_fixture_name = camelcase(parts[1]);
                  break;
                case "accept":
                case "reject":
                case "check":
                  method_parts = [];
                  value_parts = [];
                  current_index = 0;
                  if (prefix === "check") {
                    last_data_parts = parts.length - 1;
                    expected_result = parts.slice(last_data_parts)[0];
                  } else if (prefix === "accept") {
                    last_data_parts = parts.length;
                    expected_result = true;
                  } else if (prefix === "reject") {
                    last_data_parts = parts.length;
                    expected_result = true;
                  }
                  _ref = parts.slice(1, last_data_parts);
                  for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                    part = _ref[_j];
                    if (current_index % 2 === 0) {
                      method_parts.push(camelcase(part));
                    } else {
                      value_parts.push(part);
                      method_parts.push("_");
                    }
                    current_index = current_index + 1;
                  }
                  method_name = method_parts.join('');
                  fixture = fixtures[current_fixture_name];
                  result = false;
                  if (fixture != null) {
                    if (fixture[method_name] != null) {
                      obtained_result = fixture[method_name].apply(fixture, value_parts);
                      if (obtained_result === expected_result) {
                        result = true;
                      } else {
                        reason = "*obtained* : [" + obtained_result + "]";
                      }
                    } else {
                      reason = "*method [" + method_name + "] doesn't exist in fixture [" + current_fixture_name + "]*";
                      missing[current_fixture_name] = missing[current_fixture_name] || {};
                      missing[current_fixture_name][method_name] = true;
                    }
                  } else {
                    reason = "*fixture [" + current_fixture_name + "][" + fixture + "] doesn't exist*";
                    missing[current_fixture_name] = {};
                    missing[current_fixture_name]['__fixture__'] = true;
                  }
                  if (obtained_result === expected_result) {
                    console.log((["", " OK ", prefix].concat(parts.slice(1, last_data_parts)).concat([expected_result, ""])).join(" | "));
                    stats.success++;
                  } else {
                    console.log((["", "*KO*", prefix].concat(parts.slice(1, last_data_parts)).concat(["*expected* : [" + expected_result + "] " + reason, ""])).join(" | "));
                    stats.fail++;
                  }
              }
            }
          }
        }
        if (((function() {
          var _results;
          _results = [];
          for (fixture_name in missing) {
            _results.push(fixture_name);
          }
          return _results;
        })()).length > 0) {
          console.log("Missing in fixtures :");
          for (fixture_name in missing) {
            console.log("    " + fixture_name + " :");
            for (method_name in missing[fixture_name]) {
              if (missing[fixture_name][method_name] !== "__fixture__") {
                arglen = (method_name.replace(/[^_]/g, "").length);
                if (arglen > 0) {
                  console.log("        " + method_name + " : (" + ((function() {
                    var _results;
                    _results = [];
                    for (x = 1; (1 <= arglen ? x <= arglen : x >= arglen); (1 <= arglen ? x += 1 : x -= 1)) {
                      _results.push("arg" + x);
                    }
                    return _results;
                  })()).join(", ") + ") -> return");
                } else {
                  console.log("        " + method_name + " : () -> return");
                }
              }
            }
          }
        }
        console.log("");
        if (stats.fail > 0) {
          console.log("**Errors** [" + stats.success + "] Success [" + stats.fail + "] Fail");
        } else {
          console.log("All is OK [" + stats.success + "] Success");
        }
      }
    }
  });
}).call(this);
