export default function findWordsInArray(positionToSearch, positionsArr) {
    let result = [];
    if(positionToSearch==="") {
        return result;
    }

    let searchStringAsArray = positionToSearch.split(' ');
    positionsArr.forEach(positionAsString => {
        let match = true;
        searchStringAsArray.forEach(searchWord => {
            if(searchWord === "") {
                match = false;
            }else {
                const regex = new RegExp(`\\b${searchWord}s?\\b`, 'i');
                const searchWordFound = regex.test(positionAsString);
                if(!searchWordFound) {
                    match = false;
                }
            }
        })
        if(match) {
            result.push(positionAsString);
        }
    })
    return result;
}