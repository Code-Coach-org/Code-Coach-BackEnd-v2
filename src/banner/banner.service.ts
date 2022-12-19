import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannerService {

    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
    ) { }

    async insertImage(location: string) {
        const banner = this.bannerRepository.create({
            image: location
        })
        await this.bannerRepository.save(banner)
        return banner
    }

    async GetBanner() {
        return await this.bannerRepository.find();
    }

    async removeImage(id: number) {
        await this.bannerRepository.delete({ id })
        return 'del'
    }
}