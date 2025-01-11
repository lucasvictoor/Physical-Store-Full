import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Physical Store Full')
  .setDescription(
    '    A aplicação representa uma rede física de lojas para uma eCommerce. O sistema integra-se com a API do ViaCEP para obter dados de endereço, utiliza uma API de geocodificação para obter as coordenadas do cep oferecido e também utiliza a API dos Correios para conseguir realizar calculos envolvendo o serviço de fretes. Como o foco do projeto é o desenvolvimento backend, a aplicação funciona exclusivamente via terminal, sem interface gráfica no momento.'
  )
  .setVersion('1.0')
  .build();
