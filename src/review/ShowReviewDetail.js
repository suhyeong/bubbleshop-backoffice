import {theme} from "antd";
import {useParams} from "react-router-dom";
import {useState} from "react";

function ShowReviewDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 reviewNo
    const { reviewNo } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    return (
        <div></div>
    )
}

export default ShowReviewDetail;