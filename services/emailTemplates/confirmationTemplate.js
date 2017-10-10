module.exports = body => {
	return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Thank you for registering!</h3>
          <p>${body}</p>
        </div>
      </body>
    </html>
  `;
};
