#!/usr/bin/env node

try
    require.paths.unshift('.')
    kastagoo = require('kastagoo.coffee').kastagoo
    kastagoo.utils.update kastagoo, require('kastagoo.test.coffee').kastagoo
    kastagoo.utils.update kastagoo, require('kastagoo.dao.coffee').kastagoo
    
    testlib = require('sandbox.viewmodel.coffee').testlib
catch e
    testlib = @testlib
    kastagoo = @kastagoo

grut = new testlib.viewmodel.GrutVM()
poideRepo = null
vars = {}

fixtures = 
    Grut :
        TheXDataValueIs : () -> grut.XData()
        TheItemListSizeIs : () -> grut.ItemList()._innerarray.length.toString()
        ChangeXDataTo_ : (xdata) -> grut.XData(xdata); return true
        Validate : () -> grut.Validate(); return true
        TheItemListItem_HasValue : (value) -> grut.ItemList().at(parseInt(value)-1).Value()
        AddValue_ : (value) -> grut.add(value); return true
    DaoLayer :
        GetThePoideRepository : () -> poideRepo = new kastagoo.dao.WSRepository("poide"); return true
        TheNameOfThePoideRepositoryIs : () -> poideRepo.getName()
        RegisterThe_Type : (regname) -> 
            if regname == "point" 
                poideRepo.register {
                    name : "point", 
                    keys : ["left","top"],
                    createObject : (id,dict) -> { "left": dict["left"], "top":dict["top"], "id":id }                    
                    }
                return true
            return false
        CreateANewPointNamed_ : (varname) -> vars[varname] = {left:0, top:0}; return true
        SetLeftOfPoint_To_ : (varname, value) -> vars[varname].left = parseInt(value); return true
        SetTopOfPoint_To_ : (varname, value) -> vars[varname].top = parseInt(value); return true
        IdOfPoint_Is : (varname) ->
            if vars[varname].id?
                return vars[varname].id.toString()
            return "not defined"
        SavePoint_ : (varname) -> poideRepo.save(vars[varname],"point"); return true
        LoadPoint_FromId_ : (varname, id) -> vars[varname] = poideRepo.get(parseInt(id)); return true
        LeftOfPoint_Is : (varname) -> vars[varname].left+""
        TopOfPoint_Is : (varname) -> vars[varname].top+""
        SavePoint_As_ : (varname, name) -> poideRepo.save(vars[varname],"point",name); return true
        LoadPoint_FromName_ : (varname, name) -> vars[varname] = poideRepo.get(name); return true
        ClearThePoideRepository : () -> poideRepo.clear(); true

tests = [
    "| do with | grut |"
    "| check | the XData value is | poide |"
    "| check | the ItemList size is | 0 |"
    "| accept | change XData to | praf |"
    "| check | the XData value is | praf |"
    "| check | the ItemList size is | 0 |"
    "| accept | validate |"
    "| check | the ItemList size is | 1 |"
    "| check | the XData value is | new value |"
    "| check | the ItemList item | 1 | has value | [--praf--] |"
    "| check | the ItemList size is | 1 |"
    "| accept | change XData to | mank |"
    "| accept | validate |"
    "| check | the ItemList size is | 2 |"
    "| check | the ItemList item | 1 | has value | [--praf--] |"
    "| check | the ItemList item | 2 | has value | [--mank--] |"
    "| accept | add value | bar |"
    "| check | the ItemList size is | 3 |"
    "| check | the ItemList item | 1 | has value | [--praf--] |"
    "| check | the ItemList item | 2 | has value | [--mank--] |"
    "| check | the ItemList item | 3 | has value | bar |"
    "| check | the XData value is | new value |"
    
    "| do with | dao layer |"
    "| accept | get the poide repository |"
    "| check | the name of the poide repository is | poide |"
    "| accept | clear the poide repository |"
    "| accept | register the | point | type |"
    "| accept | create a new point named | a |"
    "| accept | set left of point | a | to | 41 |"
    "| accept | set top of point | a | to | 17 |"
    "| check | id of point | a | is | not defined |"
    "| accept | save point | a |"
    "| check | id of point | a | is | 1 |"
    "| accept | save point | a |"
    "| check | id of point | a | is | 1 |"
    "| accept | create a new point named | a |"
    "| check | id of point | a | is | not defined |"
    "| check | left of point | a | is | 0 |"
    "| check | top of point | a | is | 0 |"
    "| accept | load point | a | from id | 1 |"
    "| check | left of point | a | is | 41 |"
    "| check | top of point | a | is | 17 |"
    "| check | id of point | a | is | 1 |"
    "| accept | create a new point named | a |"
    "| accept | set left of point | a | to | 85 |"
    "| accept | set top of point | a | to | 127 |"
    "| check | id of point | a | is | not defined |"
    "| accept | save point | a | as | coolname |"
    "| check | id of point | a | is | 2 |"
    "| accept | load point | a | from id | 1 |"
    "| check | left of point | a | is | 41 |"
    "| check | top of point | a | is | 17 |"
    "| check | id of point | a | is | 1 |"
    "| accept | load point | a | from name | coolname |"
    "| check | left of point | a | is | 85 |"
    "| check | top of point | a | is | 127 |"
    "| check | id of point | a | is | 2 |"
    ]

kastagoo.test.runtests(tests,fixtures)
poideRepo.log()
