const normalizeUser = (rawUser) => {
  const name = { ...rawUser.name, middle: rawUser.name.middle || "" };
  const image = {
    url: rawUser?.image?.url || "https://default-image-url.com/default.jpg",
    alt: rawUser?.image?.alt || "default alt text",
  };
  const address = {
    ...rawUser.address,
    state: rawUser?.address?.state || "not defined",
  };

  const user = {
    ...rawUser,
    name: name,
    image: image,
    address: address,
  };
  return user;
};

module.exports = normalizeUser;
