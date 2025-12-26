const dotenv = require('dotenv');
const path = require('path');

// Загрузка переменных окружения
dotenv.config({ path: path.join(__dirname, '.env') });

// Подключение к БД
const { sequelize, connectDB } = require('./src/config/db');

// Подключение моделей
const Client = require('./src/models/Client');
const Carrier = require('./src/models/Carrier');
const Contact = require('./src/models/Contact');
const Order = require('./src/models/Order');
const VehicleBodyType = require('./src/models/VehicleBodyType');
const LoadingType = require('./src/models/LoadingType');
const PackageType = require('./src/models/PackageType');

// Инициализация ассоциаций
require('./src/models');

// Данные для справочников
const vehicleBodyTypes = [
    { name: "Тент 82м3" },
    { name: "Тент 90м3" },
    { name: "Тент 120м3" },
    { name: "Рефрижератор" },
    { name: "Изотерм" },
    { name: "Бортовой" },
    { name: "Контейнеровоз" },
    { name: "Трал" },
    { name: "Цельнометаллический" }
];

const loadingTypes = [
    { name: "Верхняя" },
    { name: "Боковая" },
    { name: "Задняя" },
    { name: "Полная растентовка" }
];

const packageTypes = [
    { name: "Паллеты" },
    { name: "Коробки" },
    { name: "Мешки" },
    { name: "Навалом" },
    { name: "Контейнеры" }
];

// Данные для клиентов (10 штук)
const clients = [
    { name: "ООО Логистик Плюс", inn: "7701234567", contactPerson: "Иванов Иван Иванович", phone: "+7 (495) 123-45-67", email: "ivanov@logistik.ru" },
    { name: "ЗАО ТрансКарго", inn: "7702345678", contactPerson: "Петров Петр Петрович", phone: "+7 (495) 234-56-78", email: "petrov@transcargo.ru" },
    { name: "ИП Сидоров А.В.", inn: "7703456789", contactPerson: "Сидоров Алексей Владимирович", phone: "+7 (495) 345-67-89", email: "sidorov@mail.ru" },
    { name: "ООО ГрузПеревозки", inn: "7704567890", contactPerson: "Козлов Дмитрий Сергеевич", phone: "+7 (495) 456-78-90", email: "kozlov@gruzperevozki.ru" },
    { name: "АО СтройТранс", inn: "7705678901", contactPerson: "Морозов Сергей Николаевич", phone: "+7 (495) 567-89-01", email: "morozov@stroytrans.ru" },
    { name: "ООО МегаЛогистика", inn: "7706789012", contactPerson: "Новиков Андрей Викторович", phone: "+7 (495) 678-90-12", email: "novikov@megalogistika.ru" },
    { name: "ЗАО ЭкспрессДоставка", inn: "7707890123", contactPerson: "Волков Михаил Александрович", phone: "+7 (495) 789-01-23", email: "volkov@expressdelivery.ru" },
    { name: "ООО ПромТранзит", inn: "7708901234", contactPerson: "Соколов Владимир Игоревич", phone: "+7 (495) 890-12-34", email: "sokolov@promtransit.ru" },
    { name: "ИП Лебедев М.П.", inn: "7709012345", contactPerson: "Лебедев Максим Павлович", phone: "+7 (495) 901-23-45", email: "lebedev@yandex.ru" },
    { name: "ООО КарготЭкспресс", inn: "7710123456", contactPerson: "Семенов Олег Юрьевич", phone: "+7 (495) 012-34-56", email: "semenov@cargoexpress.ru" }
];

// Данные для перевозчиков (10 штук)
const carriers = [
    { name: "ООО АвтоТранс", inn: "5001234567", contactPerson: "Кузнецов Василий Петрович", phone: "+7 (812) 123-45-67", email: "kuznetsov@avtotrans.ru" },
    { name: "ИП Попов Н.Н.", inn: "5002345678", contactPerson: "Попов Николай Николаевич", phone: "+7 (812) 234-56-78", email: "popov@mail.ru" },
    { name: "ООО СпецТранс", inn: "5003456789", contactPerson: "Федоров Игорь Владимирович", phone: "+7 (812) 345-67-89", email: "fedorov@spectrans.ru" },
    { name: "ЗАО ГрузАвто", inn: "5004567890", contactPerson: "Михайлов Артем Сергеевич", phone: "+7 (812) 456-78-90", email: "mikhailov@gruzavto.ru" },
    { name: "ООО ТрансЛайн", inn: "5005678901", contactPerson: "Александров Денис Павлович", phone: "+7 (812) 567-89-01", email: "alexandrov@transline.ru" },
    { name: "ИП Романов К.К.", inn: "5006789012", contactPerson: "Романов Константин Константинович", phone: "+7 (812) 678-90-12", email: "romanov@gmail.com" },
    { name: "ООО БыстрыйГруз", inn: "5007890123", contactPerson: "Григорьев Станислав Олегович", phone: "+7 (812) 789-01-23", email: "grigoriev@bistriygruz.ru" },
    { name: "АО МагистральТранс", inn: "5008901234", contactPerson: "Яковлев Евгений Андреевич", phone: "+7 (812) 890-12-34", email: "yakovlev@magistraltrans.ru" },
    { name: "ООО РегионАвто", inn: "5009012345", contactPerson: "Степанов Роман Викторович", phone: "+7 (812) 901-23-45", email: "stepanov@regionavto.ru" },
    { name: "ИП Николаев В.В.", inn: "5010123456", contactPerson: "Николаев Виктор Владимирович", phone: "+7 (812) 012-34-56", email: "nikolaev@yandex.ru" }
];

const seedDB = async () => {
    try {
        console.log('⏳ Подключаемся к SQLite...');
        await connectDB();

        // Синхронизация схемы (добавит новые колонки)
        await sequelize.sync({ alter: true });
        console.log('   ✓ Схема БД синхронизирована');

        // ============================================
        // ШАГ 1: УДАЛЕНИЕ ВСЕХ ДАННЫХ
        // ============================================
        console.log('🧹 Удаление существующих данных...');

        await Order.destroy({ where: {}, truncate: true });
        console.log('   ✓ Заказы удалены');

        await Contact.destroy({ where: {}, truncate: true });
        console.log('   ✓ Контакты удалены');

        await Client.destroy({ where: {}, truncate: true });
        console.log('   ✓ Клиенты удалены');

        await Carrier.destroy({ where: {}, truncate: true });
        console.log('   ✓ Перевозчики удалены');

        await VehicleBodyType.destroy({ where: {}, truncate: true });
        console.log('   ✓ Типы кузова удалены');

        await LoadingType.destroy({ where: {}, truncate: true });
        console.log('   ✓ Типы загрузки удалены');

        await PackageType.destroy({ where: {}, truncate: true });
        console.log('   ✓ Типы упаковки удалены\n');

        // ============================================
        // ШАГ 2: СОЗДАНИЕ СПРАВОЧНИКОВ
        // ============================================
        console.log('📚 Создание справочников...');

        const createdVehicleTypes = await VehicleBodyType.bulkCreate(vehicleBodyTypes);
        console.log(`   ✓ Типы кузова: ${createdVehicleTypes.length} шт.`);

        const createdLoadingTypes = await LoadingType.bulkCreate(loadingTypes);
        console.log(`   ✓ Типы загрузки: ${createdLoadingTypes.length} шт.`);

        const createdPackageTypes = await PackageType.bulkCreate(packageTypes);
        console.log(`   ✓ Типы упаковки: ${createdPackageTypes.length} шт.\n`);

        // ============================================
        // ШАГ 3: СОЗДАНИЕ КЛИЕНТОВ
        // ============================================
        console.log('👥 Создание клиентов...');
        const createdClients = await Client.bulkCreate(clients);
        console.log(`   ✓ Клиенты: ${createdClients.length} шт.\n`);

        // ============================================
        // ШАГ 4: СОЗДАНИЕ ПЕРЕВОЗЧИКОВ
        // ============================================
        console.log('🚛 Создание перевозчиков...');
        const createdCarriers = await Carrier.bulkCreate(carriers);
        console.log(`   ✓ Перевозчики: ${createdCarriers.length} шт.\n`);

        // ============================================
        // ШАГ 5: СОЗДАНИЕ КОНТАКТОВ
        // ============================================
        console.log('📞 Создание контактов...');
        const contacts = [];

        // По 1 контакту для каждого клиента
        createdClients.forEach((client) => {
            contacts.push({
                fullName: client.contactPerson,
                phones: [client.phone],
                email: client.email,
                relatedTo: 'client',
                clientId: client.id,  // Sequelize использует id вместо _id
                isActive: true
            });
        });

        // По 1 контакту для каждого перевозчика
        createdCarriers.forEach((carrier) => {
            contacts.push({
                fullName: carrier.contactPerson,
                phones: [carrier.phone],
                email: carrier.email,
                relatedTo: 'carrier',
                carrierId: carrier.id,  // Sequelize использует id вместо _id
                isActive: true
            });
        });

        const createdContacts = await Contact.bulkCreate(contacts);
        console.log(`   ✓ Контакты: ${createdContacts.length} шт.\n`);

        // ============================================
        // ШАГ 6: СОЗДАНИЕ ЗАКАЗОВ
        // ============================================
        console.log('📦 Создание заказов...');

        // Получаем контакты клиентов для связи
        const clientContacts = createdContacts.filter(c => c.relatedTo === 'client');

        const orders = [];
        const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону'];
        const cargoNames = ['Стройматериалы', 'Продукты питания', 'Электроника', 'Мебель', 'Текстиль', 'Автозапчасти', 'Бытовая техника', 'Химия', 'Металлоконструкции', 'Оборудование'];

        for (let i = 0; i < 10; i++) {
            const clientIndex = i % createdClients.length;
            const carrierIndex = i % createdCarriers.length;
            const fromCity = cities[i];
            const toCity = cities[(i + 5) % cities.length];

            orders.push({
                // Вложенные объекты route и cargo преобразуем в отдельные поля
                routeFrom: fromCity,
                routeTo: toCity,
                cargoName: cargoNames[i],
                cargoWeight: Math.floor(Math.random() * 20000) + 1000, // от 1 до 20 тонн
                dateLoading: new Date(2025, 0, i + 1), // Январь 2025
                dateUnloading: new Date(2025, 0, i + 3),
                clientId: createdClients[clientIndex].id,
                clientContactId: clientContacts[clientIndex].id,
                carrierId: createdCarriers[carrierIndex].id,
                vehicleBodyTypeId: createdVehicleTypes[i % createdVehicleTypes.length].id,
                packageTypeId: createdPackageTypes[i % createdPackageTypes.length].id,
                loadingTypeId: createdLoadingTypes[i % createdLoadingTypes.length].id,
                clientRate: Math.floor(Math.random() * 50000) + 30000, // от 30k до 80k
                carrierRate: Math.floor(Math.random() * 40000) + 20000, // от 20k до 60k
                // Новые статусы (Фаза 1)
                status: ['draft', 'inquiry', 'confirmed', 'in_transit', 'delivered'][i % 5],
                transportMode: ['auto', 'rail', 'sea', 'air', 'multimodal'][i % 5],
                direction: ['import', 'export', 'domestic', 'transit'][i % 4]
            });
        }

        const createdOrders = await Order.bulkCreate(orders);
        console.log(`   ✓ Заказы: ${createdOrders.length} шт.\n`);

        // ============================================
        // ИТОГИ
        // ============================================
        console.log('✅ SEEDING ЗАВЕРШЕН УСПЕШНО!\n');
        console.log('📊 Статистика:');
        console.log(`   • Клиенты: ${createdClients.length}`);
        console.log(`   • Перевозчики: ${createdCarriers.length}`);
        console.log(`   • Контакты: ${createdContacts.length}`);
        console.log(`   • Заказы: ${createdOrders.length}`);
        console.log(`   • Типы кузова: ${createdVehicleTypes.length}`);
        console.log(`   • Типы загрузки: ${createdLoadingTypes.length}`);
        console.log(`   • Типы упаковки: ${createdPackageTypes.length}\n`);

        process.exit(0);

    } catch (err) {
        console.error('❌ Ошибка:', err);
        process.exit(1);
    }
};

seedDB();
