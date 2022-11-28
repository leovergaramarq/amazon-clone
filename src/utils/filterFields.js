export default function (obj) {
    for (const field in obj) {
        if (obj[field] === undefined) delete obj[field];
    }
    
    return obj;
}