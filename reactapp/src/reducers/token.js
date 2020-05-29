export default function(token = null, action) {
    if (action.type === 'storeToken') {
        return action.token;   
    } else {
        return token;
    }
}