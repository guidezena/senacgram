import React, { useState } from "react";
import Layout from "../components/shared/Layouts";

import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/post/query";

import Post from "../components/feed/Post";

import { LIKE_POST } from "../graphql/post/mutation";

export default function FeedPage() {
	const [postData, setPostData] = useState([]);
	const { loading, error, data } = useQuery(GET_POSTS, {
		onCompleted: () => {
			setPostData(data.post);
		},
	});
	const [likePost] = useMutation(LIKE_POST);

	const handleLike = (post) => {
		likePost({ variables: { id: post.id } });

		setPostData((postData) => {
			const newData = [...postData];
			const likedPostI = newData.findIndex((p) => p.id == post.id);
			newData[likedPostI] = { ...newData[likedPostI], likes: newData[likedPostI].likes + 1 };
			return newData;
		});
	};

	return (
		<>
			{loading && <h1>Carregando</h1>}
			{!loading && (
				<Layout>
					<div className="row">
						<div className="col-10 mx-auto">
							{postData.map((post) => (
								<Post key={post.id} post={post} onLike={handleLike} />
							))}
						</div>
					</div>
				</Layout>
			)}
		</>
	);
}
