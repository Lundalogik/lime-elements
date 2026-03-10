import { Component, h } from '@stencil/core';

const OLD_VALUE = `class UserService {
    constructor(private db) {}

    async createUser(email, password) {
        const hash = await bcrypt.hash(password, 10);
        return this.db.users.create({ email, hash });
    }

    async findUser(email) {
        return this.db.users.findOne({ email });
    }

    async updateUser(id, data) {
        return this.db.users.update({ id }, data);
    }

    async deleteUser(id) {
        return this.db.users.delete({ id });
    }

    async listUsers(page = 1) {
        return this.db.users.findAll({ page });
    }

    async countUsers() {
        return this.db.users.count();
    }
}`;

const NEW_VALUE = `class UserService {
    constructor(private db, private cache) {}

    async createUser(email, password) {
        const hash = await bcrypt.hash(password, 12);
        return this.db.users.create({ email, hash });
    }

    async findUser(email) {
        return this.db.users.findOne({ email });
    }

    async updateUser(id, data) {
        return this.db.users.update({ id }, data);
    }

    async deleteUser(id) {
        return this.db.users.delete({ id });
    }

    async listUsers(page = 1, limit = 20) {
        return this.db.users.findAll({ page, limit });
    }

    async countUsers() {
        return this.db.users.count();
    }
}`;

/**
 * Expanding collapsed sections
 *
 * When a diff has unchanged lines between change groups, they are collapsed
 * to reduce noise. Click "hidden lines" to expand only that section —
 * other collapsed sections remain unaffected.
 */
@Component({
    tag: 'limel-example-code-diff-expand',
    shadow: true,
})
export class CodeDiffExpandExample {
    public render() {
        return (
            <limel-code-diff
                oldValue={OLD_VALUE}
                newValue={NEW_VALUE}
                oldHeading="Original"
                newHeading="Modified"
            />
        );
    }
}
