const regex = /^([A-Z]*)([\d]{0,1})([VPE]*)([\d]{2,})([FQYM]{1})([M]{0,1})([ABCDEFGHIJKLMNPQRSTUVWXY]{1,2})(-*)(.*)/gm;

const bore_orientations = {
    P: "horizontal",
    V: "V type",
    E: "2 stroke"
}
const cooling = {
    M: "water cooled",
    F: "natural air cooled",
    Q: "forced air cooled",
    Y: "oil cooled"
}

const displacements = {
    A: "<50",
    B: "50",
    C: "60",
    D: "70",
    E: "80",
    F: "90",
    G: "100",
    H: "110",
    I: "125",
    J: "150",
    K: "175",
    L: "200",
    M: "250",
    N: "300",
    P: "350",
    Q: "400",
    R: "500",
    S: "600",
    T: "650",
    U: "700",
    V: "750",
    W: "800",
    X: "900",
    Y: "1000",
    YG: "1100",
    YL: ">=1200"
}

const isMotorcycle = {
    M: true
}
const cylinders = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6
}

const getBoreSize = (size)=>parseInt(size)>99 ? size+" or "+parseInt(size)/10 : size;
const returnValue = (value)=>value ? value : "unknown";

const getFullCode = returnValue;
const getRevision = returnValue;

const code_structure = {
    0: getFullCode,
    1: manufacturers,
    2: cylinders,
    3: bore_orientations,
    4: getBoreSize,
    5: cooling,
    6: isMotorcycle,
    7: displacements,
    8: {
        "-": "-"
    },
    9: getRevision
}

const labels = ["Full code", "Manufacturer", "Number of cylinders", "Bore orientation", "Bore diameter (mm)", "Cooling type", "Is meant for motorcycle", "Displacement", "**unused**", "Revision"]

/*

const testnumbers = []
testnumbers.push(["IP54FMI", {
    Manufacturer: "Lifan?",
    "Number of cylinders": "unknown",
    "Bore orientation": "unknown",
    "Bore diameter (mm)": "54",
    "Cooling type": "natural air cooled",
    "Is meant for motorcycle": true,
    Displacement: "125",
    Revision: "unknown"
}])

testnumbers.push(["DJ152FMH", {
    Manufacturer: "http://www.dajiangmotor.com/",
    "Number of cylinders": 1,
    "Bore diameter (mm)": "52",
    "Bore orientation": "unknown",
    "Cooling type": "natural air cooled",
    "Is meant for motorcycle": true,
    Displacement: "110",
    Revision: "unknown"
}])

testnumbers.push(["QJ469MS-A", {
    Manufacturer: "Qianjiang",
    "Number of cylinders": 4,
    "Bore diameter (mm)": "69",
    "Bore orientation": "unknown",
    "Cooling type": "water cooled",
    "Is meant for motorcycle": "unknown",
    Displacement: "600",
    Revision: "A"
}])
testnumbers.push(["TZH152FMH", {
    Manufacturer: "http://www.cqtianzhong.cn/",
    "Number of cylinders": 1,
    "Bore orientation": "unknown",
    "Bore diameter (mm)": "52",
    "Cooling type": "natural air cooled",
    "Is meant for motorcycle": true,
    Displacement: "110",
    Revision: "unknown"
}])
testnumbers.push(["LC152FMI", {
    Manufacturer: "Loncin",
    "Number of cylinders": 1,
    "Bore diameter (mm)": "52",
    "Bore orientation": "unknown",
    "Cooling type": "natural air cooled",
    "Is meant for motorcycle": true,
    Displacement: "125",
    Revision: "unknown"
}])
testnumbers.push(["152FMH", {
    Manufacturer: "unknown",
    "Bore orientation": "unknown",
    "Number of cylinders": 1,
    "Bore diameter (mm)": "52",
    "Cooling type": "natural air cooled",
    "Is meant for motorcycle": true,
    Displacement: "110",
    Revision: "unknown"
}])
testnumbers.push(["LC1P391MA", {
    Manufacturer: "Loncin",
    "Number of cylinders": 1,
    "Bore orientation": "horizontal",
    "Bore diameter (mm)": "391 or 39.1",
    "Cooling type": "",
    "Is meant for motorcycle": "unknown",
    Displacement: "<50",
    Revision: "unknown"
}])
*/

function decodeValue(index, value) {
    let result = "unknown";
    const mapper = code_structure[index];
    if (typeof mapper === "function") {
        result = mapper(value)
    } else {
        try {
            if (mapper[value]) {
                result = mapper[value]
            }
        } catch (e) {
            result = "unknown value"
            console.log("ERROR: ", e, value)
        }
    }
    let returnValue = {};
    returnValue[labels[index]] = result
    return returnValue;
}

function decode(code) {
    let m;
    let decodedNumber = {}

    while ((m = regex.exec(code)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match,groupIndex)=>{
            if (groupIndex !== 0 && groupIndex !== 8) {
                Object.assign(decodedNumber, decodeValue(groupIndex, match))
            }
        }
        );
    }
    return decodedNumber;
}

/*
function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        console.log("Props length differs", aProps.sort(), bProps.sort())
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            console.log(`${a[propName]} !== ${b[propName]}`)
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

const desiredStruct = testnumbers[0][1];
const codeToCrack = testnumbers[0][0]
const decodedStruct = decode(codeToCrack);

console.log("Test code:", codeToCrack)

console.log("desired:", desiredStruct)
console.log("decoded: ", decodedStruct)

console.log("is correct:", isEquivalent(desiredStruct, decodedStruct));

testnumbers.map((struct)=>{
    const desiredStruct = struct[1];
    const codeToCrack = struct[0]
    const decodedStruct = decode(codeToCrack);

    if (!isEquivalent(desiredStruct, decodedStruct)) {

        console.log("Test code:", codeToCrack)

        console.log("desired:", desiredStruct)
        console.log("decoded: ", decodedStruct)
    }

    return isEquivalent(struct[1], decode(struct[0]));
})
*/
