const Imp = require('./TestImports');
const Tmp = require('./templateFiles').envsub;
const TmpH = require('./templateFiles').envsubh;

let diffTests = (diffTemplateFile) => {
  return [
    {
      testName: '--diff should not log diff between template file and output file by default',
      templateFile: diffTemplateFile,
      outputContents: null,
      options: {},
      postFunc: () => {
        // noinspection BadExpressionStatementJS
        Imp.expect(Imp.LogDiff.logDiff).not.to.have.been.called;
      },
      cli: {
        flags: []
      }
    },
    {
      testName: '--diff should log diff between template file and output file when flag set',
      templateFile: Tmp.DIFF_TEMPLATE_FILE,
      outputContents: null,
      options: {diff: true},
      postFunc: () => {
        // noinspection BadExpressionStatementJS
        Imp.expect(Imp.LogDiff.logDiff).to.have.been.called;
      },
      cli: {
        flags: ['--diff']
      }
    }
  ];
};

let envsub = [
  ...diffTests(Tmp.DIFF_TEMPLATE_FILE),
  {
    testName: '--env should only substitute given environment variables',
    preFunc: () => {
      process.env.EXISTA = 'AAAENV';
      process.env.EXISTB = 'BBBENV';
      process.env.EXISTC = 'CCCENV';
    },
    templateFile: Tmp.ENV_TEMPLATE_FILE,
    outputContents: Tmp.ENV_TEMPLATE_FILE_EXPECTED,
    options: {
      envs: [
        {name: 'EXISTB'},
        {name: 'EXISTC', value: 'CCCEQL'},
        {name: 'NOEXISTY'},
        {name: 'NOEXISTZ', value: 'ZZZEQL'},
        {}
      ]
    },
    cli: {
      flags: [
        '--env',
        'EXISTB',
        '--env',
        'EXISTC=CCCEQL',
        '--env',
        'NOEXISTY',
        '--env',
        'NOEXISTZ=ZZZEQL',
      ]
    }
  },
  {
    testName: '--env should not substitute environment variables with invalid names',
    templateFile: Tmp.ENV_INVALID_TEMPLATE_FILE,
    outputContents: Tmp.ENV_INVALID_TEMPLATE_FILE_EXPECTED,
    options: {
      envs: [
        {name: 'VALID', value: 'SUB'},
        {name: '9INVALID', value: 'NOSUB'},
      ]
    },
    postFunc: () => {
      Imp.expect(console.warn).to.have.been.calledWithMatch(/Skipping environment variable '9INVALID'/);
    },
    cli: {
      flags: [
        '--env',
        'VALID=SUB',
        '--env',
        '9INVALID=NOSUB'
      ]
    }
  },
  {
    testName: '--protect should substitute non-existent environment variables by default',
    templateFile: Tmp.PROTECT_TEMPLATE_FILE,
    outputContents: Tmp.PROTECT_TEMPLATE_FILE_OFF_EXPECTED,
    options: {},
    cli: {
      flags: []
    }
  },
  {
    testName: '--protect should not substitute non-existent environment variables when flag set',
    templateFile: Tmp.PROTECT_TEMPLATE_FILE,
    outputContents: Tmp.PROTECT_TEMPLATE_FILE_ON_EXPECTED,
    options: {protect: true},
    cli: {
      flags: ['--protect']
    }
  },
  {
    testName: '--syntax should support default syntax',
    templateFile: Tmp.SYNTAX_TEMPLATE_FILE,
    outputContents: Tmp.SYNTAX_TEMPLATE_FILE_DEFAULT_EXPECTED,
    options: {syntax: 'default'},
    cli: {
      flags: [
        '--syntax',
        'default'
      ]
    }
  },
  {
    testName: '--syntax should support dollar basic syntax',
    templateFile: Tmp.SYNTAX_TEMPLATE_FILE,
    outputContents: Tmp.SYNTAX_TEMPLATE_FILE_DOLLAR_BASIC_EXPECTED,
    options: {syntax: 'dollar-basic'},
    cli: {
      flags: [
        '--syntax',
        'dollar-basic'
      ]
    }
  },
  {
    testName: '--syntax should support dollar both syntax',
    templateFile: Tmp.SYNTAX_TEMPLATE_FILE,
    outputContents: Tmp.SYNTAX_TEMPLATE_FILE_DOLLAR_BOTH_EXPECTED,
    options: {syntax: 'dollar-both'},
    cli: {
      flags: [
        '--syntax',
        'dollar-both'
      ]
    }
  },
  {
    testName: '--syntax should support dollar curly syntax',
    templateFile: Tmp.SYNTAX_TEMPLATE_FILE,
    outputContents: Tmp.SYNTAX_TEMPLATE_FILE_DOLLAR_CURLY_EXPECTED,
    options: {syntax: 'dollar-curly'},
    cli: {
      flags: [
        '--syntax',
        'dollar-curly'
      ]
    }
  },
  {
    testName: '--syntax should support handlebars syntax',
    templateFile: Tmp.SYNTAX_TEMPLATE_FILE,
    outputContents: Tmp.SYNTAX_TEMPLATE_FILE_HANDLEBARS_EXPECTED,
    options: {syntax: 'handlebars'},
    cli: {
      flags: [
        '--syntax',
        'handlebars'
      ]
    }
  }
];

let envsubh = [
  ...diffTests(TmpH.DIFF_TEMPLATE_FILE)
];

module.exports = {
  envsub,
  envsubh
};