function getCount(str) {
    let vowels = ['a', 'e', 'i', 'o', 'u'];
    return str.split('').filter(char => vowels.includes(char)).length;;
}

console.log(getCount("abracadabra"))