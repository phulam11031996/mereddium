import { useParams } from "react-router-dom";
import { render_postList } from "./post";

export default function PostSearch(props) {
    // get posts and search query
    var postList = props.posts;
    const { query } = useParams();

    // set-up regex using query
    const re = new RegExp(query, 'i');

    // filter posts by evaluating regex on post titles
    postList = postList.filter((post) => {
        return re.test(post['title']);
    })

    // render filtered post list
    return render_postList(postList);
}
