#!/usr/bin/env node

require.paths.unshift('.')
kastagoo = require('kastagoo.coffee').kastagoo
kastagoo.utils.update kastagoo, require('kastagoo.test.coffee').kastagoo

testlib = require('sandbox.viewmodel.coffee').testlib

grut = new testlib.viewmodel.GrutVM()

fixtures = 
    Grut :
        TheXDataValueIs : () -> grut.XData()
        TheItemListSizeIs : () -> grut.ItemList()._innerarray.length.toString()
        ChangeXDataTo_ : (xdata) -> grut.XData(xdata); return true
        Validate : () -> grut.Validate(); return true
        TheItemListItem_HasValue : (value) -> grut.ItemList().at(parseInt(value)-1).Value()
        AddValue_ : (value) -> grut.add(value); return true

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
    ]


kastagoo.test.runtests(tests,fixtures)


