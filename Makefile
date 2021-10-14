install:
	npm install

lint:
	npx stylelint src/scss/*
	npx htmlhint src/index.html
	npx htmlhint src/artist.html

watch:
	sass -w --poll src/scss/style.scss src/css/style.css

deploy:
	npx surge ./src/
