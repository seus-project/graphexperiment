# D populate app

This code is used to populate a database in arangoDB using D language.

## Compiler

The source code in this experiment is written in the [D programming language](https://dlang.org/), and various compilers for all major platforms can be downloaded from there. The compilation assumes the presence of package manager Dub, which is included in most D compiler distributions.

## Execution

After the above prerequisites have been met, the experiment is run by invoking

```bash
dub run -- --pw="_PW_" --ip=_IP_
```

This is defined in `docker-compose.yaml` file in the project root.
