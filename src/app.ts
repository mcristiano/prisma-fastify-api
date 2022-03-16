import buildServer from './server';

const server = buildServer();

async function main() {
  try {
    // 0.0.0.0 listens on all ports
    const port = process.env.PORT || 3000;
    await server.listen(port, '0.0.0.0');
    console.log(`Server ready at http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
