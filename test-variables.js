// 测试文件 - 用于验证Variable Formatter插件功能

// 测试变量 - 选中这些变量名并使用插件格式化
let my_variable_name = 'test';           // snake_case
let MyVariableName = 'test';             // PascalCase  
let myVariableName = 'test';             // camelCase
let my_kebab_case_var = 'test';          // mixed
let CONSTANT_VALUE = 'test';             // UPPER_SNAKE_CASE
let mixedCase_variable = 'test';         // mixed format
let anotherKebabCase = 'test';           // will be converted to kebab-case
let simplevar = 'test';                  // lowercase

// 函数名测试
function calculate_total_price() {       // snake_case
    return 0;
}

function CalculateTotalPrice() {         // PascalCase
    return 0;
}

function calculateTotalPrice() {         // camelCase
    return 0;
}

// 类名测试
class user_profile_manager {            // snake_case
    constructor() {}
}

class UserProfileManager {              // PascalCase
    constructor() {}
}

class userProfileManager {              // camelCase
    constructor() {}
}