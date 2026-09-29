import { expect } from 'chai';
import { Library } from '../src/services/Library';

describe('Library', () => {
  it('should add an item', () => {
    const lib = new Library<{id: string, name: string}>();
    lib.add({ id: '1', name: 'Item 1' });
    expect(lib.getAll().length).to.equal(1);
  });

  it('should not add item with existing id', () => {
    const lib = new Library<{id: string, name: string}>();
    lib.add({ id: '1', name: 'Item 1' });
    lib.add({ id: '1', name: 'Item 2' });
    expect(lib.getAll().length).to.equal(1);
    expect(lib.find('1')?.name).to.equal('Item 1');
  });

  it('should remove an item by id', () => {
    const lib = new Library<{id: string, name: string}>();
    lib.add({ id: '1', name: 'Item 1' });
    lib.add({ id: '2', name: 'Item 2' });
    lib.remove('1');
    expect(lib.getAll().length).to.equal(1);
    expect(lib.find('1')).to.be.undefined;
  });

  it('should find an item by id', () => {
    const lib = new Library<{id: string, name: string}>();
    lib.add({ id: '1', name: 'Item 1' });
    const item = lib.find('1');
    expect(item).to.not.be.undefined;
    expect(item?.name).to.equal('Item 1');
  });
});
