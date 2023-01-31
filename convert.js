const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDirectory = './input';
const outputDirectory = './output';

const config = {
    // sizes: [4096, 2048, 1024],
    sizes: [],
    scales: [1, 0.5, 0.25],
    formats: ['png', 'jpg', 'webp']
};

fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach(file => {
        const inputFile = path.join(inputDirectory, file);
        const baseFileName = path.parse(file).name;

        const outputFolder = path.join(outputDirectory, baseFileName);

        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        } else {
            fs.rmdirSync(outputFolder, { recursive: true });
            fs.mkdirSync(outputFolder);
        }

        sharp(inputFile)
            .metadata()
            .then(metadata => {
                const originalWidth = metadata.width;

                config.formats.forEach(format => {
                    config.sizes.forEach(size => {
                        const outputFile = path.join(
                            outputFolder,
                            `${baseFileName}-${size}.${format}`
                        );

                        sharp(inputFile)
                            .resize({ width: size })
                            .toFormat(format)
                            .toFile(outputFile, (error, info) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    console.log(
                                        `Successfully converted ${inputFile} to ${outputFile} in ${format} format`
                                    );
                                }
                            });
                    });

                    config.scales.forEach(scale => {
                        const outputFile = path.join(
                            outputFolder,
                            `${baseFileName}-${scale}x.${format}`
                        );

                        sharp(inputFile)
                            .resize({ width: Math.round(originalWidth * scale) })
                            .toFormat(format)
                            .toFile(outputFile, (error, info) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    console.log(
                                        `Successfully converted ${inputFile} to ${outputFile} in ${format} format`
                                    );
                                }
                            });
                    });
                });
            })
            .catch(error => {
                console.error(error);
            });
    });
});
