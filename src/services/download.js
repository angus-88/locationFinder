const downloadFile = (filename, fileType, fileContent) => {
  const element = document.createElement('a');
  const file = new Blob([fileContent], { type: fileType });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}-output.csv`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

export default downloadFile;
