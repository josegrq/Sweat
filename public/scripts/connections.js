checkFollowStatus = (id) => {
  const followButton = document.getElementById(id);
  //Perform action depending on button status
  if (followButton.innerHTML == "Follow") {
    async function startFollowing() {
      const response = await fetch(`/api/users/${id}/follow`);
      const resJSON = await response.json();
      if (resJSON.data.success && resJSON.status === 200) {
        followButton.innerHTML = "Unfollow";
        followButton.classList.add("unfollow");
        followButton.classList.remove("follow");
      }
    }
    startFollowing();
  } else {
    async function stopFollowing() {
      const response = await fetch(`/api/users/${id}/unfollow`);
      const resJSON = await response.json();
      if (resJSON.data.success && resJSON.status === 200) {
        followButton.innerHTML = "Follow";
        followButton.classList.remove("unfollow");
        followButton.classList.add("follow");
      }
    }
    stopFollowing();
  }
};
