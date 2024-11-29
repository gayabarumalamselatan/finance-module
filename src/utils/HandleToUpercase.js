const HandleToUppercase = (data) => {
	return data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    );
}

export {HandleToUppercase}