kastagoo = @kastagoo = @kastagoo || require("kastagoo.utils.coffee").kastagoo

capitalize = (name) -> name.toUpperCase().substr(0,1) + name.substr(1)
camelcase = (name) -> ( capitalize(x) for x in name.replace(/[^a-zA-Z0-9]+/ig," ").split(" ")).join("")

kastagoo.utils.update kastagoo,
    test :
        camelcase : camelcase
        capitalize : capitalize
        runtests : (tests,fixtures) ->
            current_fixture_name = null
            missing = {}
            stats = 
                success : 0
                fail : 0
            for line in tests 
                line = line.replace(/^[\s\t]+/g,"")
                line = line.replace(/\*/g,"**star**").replace(/\\\|/g,"**pipe**")
                if line.substr(0,1) == "|"
                    parts = (part.replace(/^[\s\t]+/g,"").replace(/[\s\t]+$/g,"") for part in line.split("|")).slice(1)
                    parts = (part.replace(/\*\*pipe\*\*/g, "|").replace(/\*\*star\*\*/g, "*") for part in parts)
                    if parts.length > 0
                        if parts[parts.length-1] == '' 
                            parts = parts.slice(0,parts.length-1)
                    
                        prefix = parts[0].toLowerCase()
                        switch prefix
                            when "do with" then current_fixture_name = camelcase(parts[1])
                            when "accept", "reject", "check" 
                                method_parts = []
                                value_parts = []
                                current_index = 0
                                
                                if prefix == "check"
                                    last_data_parts = parts.length-1
                                    expected_result = parts.slice(last_data_parts)[0]    
                                else if prefix == "accept"
                                    last_data_parts = parts.length
                                    expected_result = true
                                else if prefix == "reject"
                                    last_data_parts = parts.length
                                    expected_result = true
                                
                                for part in parts.slice(1,last_data_parts)
                                    if current_index%2 == 0
                                        method_parts.push(camelcase part)
                                    else 
                                        value_parts.push(part)
                                        method_parts.push("_")
                                    current_index = current_index + 1
                                    
                                method_name = method_parts.join('')
                                
                                
                                fixture = fixtures[current_fixture_name]
                                result = false
                                if fixture?
                                    if fixture[method_name]?
                                        obtained_result = fixture[method_name].apply(fixture,value_parts)
                                        if obtained_result == expected_result
                                            result = true
                                        else 
                                            reason = "*obtained* : ["+obtained_result+"]"
                                            
                                    else 
                                        reason = "*method ["+method_name+"] doesn't exist in fixture ["+current_fixture_name+"]*"
                                        missing[current_fixture_name] = missing[current_fixture_name] || {}
                                        missing[current_fixture_name][method_name] = true
                                else
                                    reason = "*fixture ["+current_fixture_name+"]["+fixture+"] doesn't exist*"
                                    missing[current_fixture_name] = {}
                                    missing[current_fixture_name]['__fixture__'] = true
                                
                                if obtained_result == expected_result
                                    console.log (([""," OK ",prefix].concat(parts.slice(1,last_data_parts)).concat([expected_result,""])).join(" | "))
                                    stats.success++
                                else 
                                    console.log ((["","*KO*",prefix].concat(parts.slice(1,last_data_parts)).concat(["*expected* : ["+expected_result+"] "+reason,""])).join(" | "))
                                    stats.fail++
            if (fixture_name for fixture_name of missing).length > 0 
                console.log("Missing in fixtures :")
                for fixture_name of missing
                    console.log("    "+fixture_name+" :")
                    for method_name of missing[fixture_name]
                        if missing[fixture_name][method_name] != "__fixture__"
                            arglen = (method_name.replace(/[^_]/g,"").length)
                            if arglen > 0
                                console.log("        "+method_name+" : ("+("arg"+x for x in [1..arglen]).join(", ")+") -> return")
                            else 
                                console.log("        "+method_name+" : () -> return")
                                    # console.log(["*check*",method_name,value_parts,expected_result])
            console.log("")
            if stats.fail > 0
                console.log("**Errors** ["+stats.success+"] Success ["+stats.fail+"] Fail")
            else
                console.log("All is OK ["+stats.success+"] Success")
            return 
    
