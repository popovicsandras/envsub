const Imp = require('../_classes/TestImports');
const MY_TEMPLATE_FILE = `${__dirname}/templateFile`;
const MY_OUTPUT_FILE = `${__dirname}/outputFile`;

describe('envsub local', () => {



  before(() => {
    process.env.MY_NAME = 'Daniel';
  });













  after((done) => {
    Imp.del([`${__dirname}/outputFile*`, `${__dirname}/templateFile*`, `!${__dirname}/templateFile`]).then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  let verifyEnvObj = (envobj, templateFile, outputFile) => {
    Imp.expect(envobj.templateContents).to.eql('xxx{{ MY_NAME }}xxx\n');
    Imp.expect(envobj.templateFile).to.eql(templateFile);
    Imp.expect(envobj.outputContents).to.eql('xxxDanielxxx\n');
    Imp.expect(envobj.outputFile).to.eql(outputFile);
  };

  it('should substitute env vars in template file and write to output file', (done) => {

    let templateFile = MY_TEMPLATE_FILE;
    let outputFile = MY_OUTPUT_FILE;

    Imp.envsub(templateFile, outputFile).then((envobj) => {
      verifyEnvObj(envobj, templateFile, outputFile);


      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('should substitute env vars in template file and overwrite template file where one arg is given', (done) => {

    let templateFile = `${__dirname}/templateFile2`;

    // Create template file
    Imp.fs.writeFileSync(templateFile, Imp.fs.readFileSync(MY_TEMPLATE_FILE));

    Imp.envsub(templateFile).then((envobj) => {
      verifyEnvObj(envobj, templateFile, templateFile);


      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('should reject where no args are given', (done) => {

    Imp.envsub().then(() => {
      done(Error('Did not reject'));
    }).catch((err) => {
      Imp.expect(err.message).to.contain('missing args');


      done();
    });
  });

  it('should reject where template file does not exist', (done) => {

    let templateFile = `${__dirname}/noTemplateFile`;
    let outputFile = MY_OUTPUT_FILE;

    Imp.envsub(templateFile, outputFile).then(() => {
      done(Error('Did not reject'));
    }).catch((err) => {
      Imp.expect(err.code).to.eql('ENOENT');
      Imp.expect(err.path).to.match(/noTemplateFile$/);


      done();
    });
  });
});