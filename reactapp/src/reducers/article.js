export default function(wishlist = [], action) {
    if (action.type === 'getWishlist') {
        return (action.wishlist)
    } else if (action.type === 'addArticle') {
        var copyWishlist = [...wishlist];
        if (copyWishlist.find(article => article.articleTitle === action.likedArticle.articleTitle) !== undefined) {
            return wishlist;
        } else {   
            copyWishlist.push(action.likedArticle);
            return copyWishlist;
        }
    } else if (action.type === 'deleteArticle') {
        var copyWishlist = [...wishlist];
        copyWishlist = copyWishlist.filter(article => article.articleTitle !== action.articleTitle);
        return copyWishlist;
    } else {
        return wishlist;
    }
}